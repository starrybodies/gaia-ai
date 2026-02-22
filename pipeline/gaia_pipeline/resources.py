import os
import psycopg2
import redis as redis_lib
from dagster import ConfigurableResource

class DatabaseResource(ConfigurableResource):
    connection_string: str = os.getenv("DATABASE_URL", "")

    def get_connection(self):
        return psycopg2.connect(self.connection_string)

class RedisResource(ConfigurableResource):
    url: str = os.getenv("UPSTASH_REDIS_URL", "redis://localhost:6379")

    def get_client(self):
        return redis_lib.from_url(self.url)

db_resource = DatabaseResource()
redis_resource = RedisResource()
