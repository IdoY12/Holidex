#!/bin/bash
set -e

# create bucket
awslocal s3 mb s3://images.sunnydb.com

# upload all images in ready.d/images folder
awslocal s3 cp /etc/localstack/init/ready.d/images/ s3://images.sunnydb.com/ --recursive
