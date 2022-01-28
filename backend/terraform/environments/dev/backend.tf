terraform {
  backend "s3"{
      bucket = "upgrade-terraform-tfstate"
      key  =  "Users/pratik/bin/pratik_prajapati_accessKeys.csv"
      region = "us-east-1"
      profile = "pratik_prajapati"
  }
}