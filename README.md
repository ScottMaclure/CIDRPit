# CIDRPit - Lightweight Serverless API based IPAM

Built with AWS Lambda and DynamoDB.

## Terminology

A *pool* is a name that can contain multiple *roots*. E.g. "dev", "prod". Pools don't have to be explicitly created.

A *root* is a CIDR that is available for consumption. E.g. 10.0.0.0/16.

A *reservation* is a CIDR that has been reserved.

## Setup

### (Optional) Run DynamoDB Local

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html

```bash
java -Djava.library.path=/tmp/dynamodb-local/DynamoDBLocal_lib -jar /tmp/dynamodb-local/DynamoDBLocal.jar -sharedDb

# Quick test
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### Setup CIDRPit

(Currently only for local dev)

```bash
pip install -r requirements.txt
export CIDRPIT_PYNAMODB_HOST="http://localhost:8000"  # If you want to use DynamoDB Local
AWS_PROFILE=dummy python setup.py  # Use dummy creds for local, real creds for an aws account.
AWS_PROFILE=mycreds AWS_REGION=ap-southeast-1 python setup.py  # Use real creds plus a region for AWS
```

## Running the API

```bash
AWS_PROFILE=dummy flask run  # For local
AWS_PROFILE=mycreds AWS_REGION=ap-southeast-1 flask run  # For AWS
```

This is supposed to also run in Lambda using serverless-wsgi once the IaC is ready. See handler.py.

## Requests

List roots and reservations, optionally by pool:

```bash
curl http://localhost:5000/roots/
curl http://localhost:5000/roots/dev
curl http://localhost:5000/reservations/
curl http://localhost:5000/reservations/dev
```

Create a root:

```bash
curl -X POST http://localhost:5000/roots/dev -H 'Content-type: application/json' -d '{"cidr":"10.0.0.0/16"}'
```

Create a reservation by prefix length:

```bash
curl -X POST http://localhost:5000/reservations/dev -H 'Content-type: application/json' -d '{"prefix_length":28,"comment":"My nice reservation"}'
```

Create a reservation by CIDR:

```bash
curl -X POST http://localhost:5000/reservations/dev -H 'Content-type: application/json' -d '{"cidr":"10.0.24.0/24","comment":"My specific reservation"}'
```

Delete a reservation:

```bash
curl -X DELETE http://localhost:5000/reservations/dev/10.0.24.0/24 
```

Delete a root (must be empty):

```bash
curl -X DELETE http://localhost:5000/root/dev/10.0.0.0/16 
```

## Using the python interface

```python
import main

main.create_root('10.0.0.0/16', 'dev')
main.create_root('10.2.0.0/16', 'prod')

main.allocate(24, 'dev')
main.allocate_by_cidr('dev', '10.0.112.0/24')

for root in main.list_roots():
    print(f'{root.cidr} {root.pool_name}')

main.deallocate('10.0.112.0/24')
main.delete_root('10.0.0.0/16')
```

## Web SPA

### Dependencies

* https://github.com/WebReflection/uhtml
* https://jenil.github.io/chota/
* https://feathericons.com/
