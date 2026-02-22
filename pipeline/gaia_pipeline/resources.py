import psycopg2
import redis as redis_lib
from dagster import ConfigurableResource, EnvVar

class DatabaseResource(ConfigurableResource):
    connection_string: str = EnvVar("DATABASE_URL")

    def get_connection(self):
        return psycopg2.connect(self.connection_string)

class RedisResource(ConfigurableResource):
    url: str = EnvVar("UPSTASH_REDIS_URL")

    def get_client(self):
        return redis_lib.from_url(self.url)

db_resource = DatabaseResource()
redis_resource = RedisResource()
