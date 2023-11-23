from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime
from .models import *
from .serializer import *

import pandas as pd
import re


# Create your views here.
class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Registration successful"}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get(
                "user"
            )  # Use get() instead of indexing to avoid KeyError
            if user:
                # Perform any additional actions you need with the authenticated user
                return Response({"message": "Login successful"})
            else:
                return Response(
                    {"message": "User not found"}, status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def upload_file(request):
    try:
        # Validate the incoming data
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extract the file from the validated data
        file = serializer.validated_data["file"]
        file_name = file.name

        # Create a new FileUpload instance
        file_upload = FileUpload.objects.create(file_name=file_name)
        # Read the file data using pandas
        df = pd.read_csv(
            file
        )  # Modify this line based on the file format (e.g., pd.read_excel for Excel files)

        # Remove rows with any undefined data
        df = df.dropna()
        # Check and adjust data types
        for column in df.columns:
            if column == "Transaction ID":
                df[column] = pd.to_numeric(
                    df[column], errors="coerce", downcast="integer"
                )
            elif column == "Transaction Date":
                df[column] = pd.to_datetime(df[column], errors="coerce")
            elif column == "Amount":
                # Extract numeric values and handle various currency symbols
                df[column] = df[column].apply(lambda x: re.sub(r"[^\d.]", "", str(x)))
                df[column] = pd.to_numeric(df[column], errors="coerce")
                df[column] = df[column].round(2)

            elif column == "Merchant Name":
                df[column] = df[column].astype(str)

        # Process and store the data in the database
        transactions = [
            Transaction(
                file_upload=file_upload,
                transaction_id=row[0],
                transaction_date=row[1],
                amount=row[2],
                merchant_name=row[3],
            )
            for row in df.itertuples(index=False)
        ]

        Transaction.objects.bulk_create(transactions)

        # Return a success response with the transactions data
        transactions_data = [
            {
                "transaction_id": t.transaction_id,
                "transaction_date": t.transaction_date,
                "amount": t.amount,
                "merchant_name": t.merchant_name,
            }
            for t in transactions
        ]

        return Response(
            {
                "message": "File data processed and stored successfully.",
                "file_name": file_name,
                "transactions": transactions_data,
            }
        )

    except pd.errors.ParserError:
        # Handle parsing errors
        return Response(
            {
                "error": "Failed to parse the file. Please make sure it is in the correct format."
            },
            status=400,
        )

    except Exception as e:
        # Handle other exceptions
        return Response({"error": f"An error occurred: {str(e)}"}, status=500)


@api_view(["POST"])
def apply_transformation(request):
    try:
        file_name = request.data.get("file_name")

        transformation_type = request.data.get("transformation[type]")
        transformation_column = request.data.get("transformation[column]")
        transformation_factor = request.data.get("transformation[factor]")
        transformation = {
            "type": transformation_type,
            "column": transformation_column,
            "factor": transformation_factor,
        }

        # Get the original data
        file_upload = FileUpload.objects.filter(file_name=file_name).last()
        transactions = Transaction.objects.filter(file_upload=file_upload)

        # Apply transformations
        transformed_data = transactions.values()

        if transformation["type"] == "Multiply":
            column = transformation["column"]
            factor = float(transformation["factor"])
            transformed_data = [
                {**item, column: float(item[column]) * factor}
                for item in transformed_data
            ]
        elif transformation["type"] == "Add":
            column = transformation["column"]
            factor = float(transformation["factor"])
            transformed_data = [
                {**item, column: float(item[column]) + factor}
                for item in transformed_data
            ]
        elif transformation["type"] == "Subtract":
            column = transformation["column"]
            factor = float(transformation["factor"])
            transformed_data = [
                {**item, column: float(item[column]) - factor}
                for item in transformed_data
            ]

        transformed_file = FileUpload.objects.create(
            file_name=f"updated_{file_name}", upload_time=datetime.now().time()
        )

        # Create instances of the Transaction model
        transformed_transactions = [
            Transaction(
                file_upload=transformed_file,
                transaction_id=item["transaction_id"],
                transaction_date=item["transaction_date"],
                amount=item["amount"],
                merchant_name=item["merchant_name"],
            )
            for item in transformed_data
        ]

        # Use bulk_create with the model instances
        Transaction.objects.bulk_create(transformed_transactions)

        # Store the transformed data
        TransformedFile.objects.create(
            transformed_file=transformed_file,  # Use the original file_upload instance
            original_file=file_upload,
            transformation_type=transformation_type,
            transformation_column=transformation_column,
            transformation_factor=transformation_factor,
        )

        transformed_table = [
            {
                "transaction_id": t["transaction_id"],
                "transaction_date": t["transaction_date"],
                "amount": t["amount"],
                "merchant_name": t["merchant_name"],
            }
            for t in transformed_data
        ]
        return Response(
            {
                "message": "Transformations applied successfully.",
                "transformed_data": transformed_table,
            }
        )

    except FileUpload.DoesNotExist:
        return Response({"error": "File not found."}, status=404)

    except Exception as e:
        print(str(e))
        return Response({"error": f"An error occurred: {str(e)}"}, status=500)
