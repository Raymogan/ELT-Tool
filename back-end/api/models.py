from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_set",  # Add a related_name to avoid clashes
        related_query_name="customuser",
        blank=True,
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_set",  # Add a related_name to avoid clashes
        related_query_name="customuser",
        blank=True,
        verbose_name="user permissions",
        help_text="Specific permissions for this user.",
    )

    def __str__(self):
        return self.email


class FileUpload(models.Model):
    file_name = models.CharField(max_length=255)
    upload_time = models.DateTimeField(auto_now_add=True)


class Transaction(models.Model):
    file_upload = models.ForeignKey(FileUpload, on_delete=models.CASCADE)
    transaction_id = models.IntegerField()
    transaction_date = models.DateField()
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    merchant_name = models.CharField(max_length=100)

    def __str__(self):
        return f"Transaction ID: {self.transaction_id} - File: {self.file_upload.file_name}"

    class Meta:
        verbose_name_plural = "Transactions"


class TransformedFile(models.Model):
    transformed_file = models.ForeignKey(
        FileUpload,
        on_delete=models.CASCADE,
        related_name="transformed_file",
        default="",
    )
    original_file = models.ForeignKey(
        FileUpload, on_delete=models.CASCADE, related_name="original_file", default=None
    )
    transformation_type = models.CharField(max_length=100, default="")
    transformation_column = models.CharField(max_length=100, default="")
    transformation_factor = models.DecimalField(
        max_digits=8, decimal_places=2, default=1
    )

    def __str__(self):
        return f"Transformed File: {self.file_upload.file_name}"

    class Meta:
        verbose_name_plural = "Transformed Files"
