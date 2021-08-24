# General variables
variable "current_directory"{}
variable "aws_region"{}
variable "aws_profile"{}
variable "environment"{}
variable "prefix"{}
variable "app_version"{}

# RDS related details 
variable "allocated_storage"{}
variable "engine_version"{}
variable "identifier"{}
variable "instance_class"{}
variable "storage_type"{}
variable "multi_az"{}

# EBS instance details
variable "app_instance_type"{}
variable "ebs_app_name"{}
variable "autoscaling_min_size"{}
variable "autoscaling_max_size"{}

# APP environment variables
variable "EXP_IDS"{}
variable "GOOGLE_CLIENT_ID"{}
variable "GROUP_TYPES"{}
variable "DOMAIN_NAME"{
    default     = ""
}
variable "CLIENT_API_KEY"{}
variable "CLIENT_API_SECRET"{}
variable "MONITOR_PASSWORD"{}
variable "SWAGGER_PASSWORD"{}
variable "TYPEORM_SYNCHRONIZE"{}
variable "TOKEN_SECRET_KEY"{}
variable "TYPEORM_MAX_QUERY_EXECUTION_TIME" {}
variable "NEW_RELIC_LICENSE_KEY" {}
variable "AUTH_CHECK"{}

# CICD variables
variable "repository_name"{}
variable "branch_name"{}
variable "build_image"{}
variable "build_compute_type"{}
variable "privileged_mode"{}
