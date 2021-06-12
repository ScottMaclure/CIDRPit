import os
from ipaddress import IPv4Network

from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute, NumberAttribute

# See https://pynamodb.readthedocs.io/en/latest/local.html
CIDRPIT_PYNAMODB_HOST = os.environ.get("CIDRPIT_PYNAMODB_HOST", None)
if CIDRPIT_PYNAMODB_HOST is not None:
    print(f'Setting CIDRPIT_PYNAMODB_HOST={CIDRPIT_PYNAMODB_HOST}')

AWS_REGION = os.environ.get("AWS_REGION", "ap-southeast-1")  # Or us-east-1?


class RootIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()
        host = CIDRPIT_PYNAMODB_HOST
        region = AWS_REGION
    root_of_pool = UnicodeAttribute(hash_key=True)
    created = NumberAttribute(range_key=True)


class FreeCapacityIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()
        host = CIDRPIT_PYNAMODB_HOST
        region = AWS_REGION
    capacity_in_pool = UnicodeAttribute(hash_key=True)
    prefix_length = NumberAttribute(range_key=True)


class ReservationByPoolIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()
        host = CIDRPIT_PYNAMODB_HOST
        region = AWS_REGION
    reservation_in_pool = UnicodeAttribute(hash_key=True)
    created = NumberAttribute(range_key=True)


class ReservationByRootIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()
        host = CIDRPIT_PYNAMODB_HOST
        region = AWS_REGION
    root_cidr = UnicodeAttribute(hash_key=True)
    created = NumberAttribute(range_key=True)


class CidrPitModel(Model):
    class Meta:
        table_name = 'CIDRpit'
        read_capacity_units = 1
        write_capacity_units = 1
        host = CIDRPIT_PYNAMODB_HOST
        region = AWS_REGION
    pool_name = UnicodeAttribute()
    cidr = UnicodeAttribute(hash_key=True)
    prefix_length = NumberAttribute(range_key=True)
    created = NumberAttribute()
    root_cidr = UnicodeAttribute(null=True)
    root_of_pool = UnicodeAttribute(null=True) # if this is a root
    left_free = UnicodeAttribute(null=True)
    right_free = UnicodeAttribute(null=True)
    capacity_in_pool = UnicodeAttribute(null=True)
    reservation_in_pool = UnicodeAttribute(null=True)
    comment = UnicodeAttribute(null=True)
    root_index = RootIndex()
    free_capacity_index = FreeCapacityIndex()
    reservation_by_root_index = ReservationByRootIndex()
    reservation_by_pool_index = ReservationByPoolIndex()

    @property
    def net(self) -> IPv4Network:
        return IPv4Network(f'{self.cidr}')