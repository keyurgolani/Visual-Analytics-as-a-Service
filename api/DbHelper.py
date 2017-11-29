import pymysql.cursors
import pymysql
from errors import *


class DbHelper(object):
    __connection = None;
    __cursor = None;

    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = "V1nayaka"
    DB = "VAAAS"

    def __init__(self):
        self.__connection = pymysql.connect(
            host=self.DB_HOST,
            user = self.DB_USER,
            password = self.DB_PASSWORD,
            db = self.DB,
            charset = 'utf8mb4',
            cursorclass = pymysql.cursors.DictCursor
        );

    def query(self, query, params=None):
        print "========================Query==========================="
        print query
        print "========================================================"
        cursor = self.__connection.cursor()
        if params:
            result = cursor.execute(query, params)
        else:
            result = cursor.execute(query)
        return cursor.fetchall()

    def insert(self, query, params=None):
        print "========================Query==========================="
        print query
        print "========================================================"
        cursor = self.__connection.cursor()
        try:
            if params:
                result = cursor.execute(query, params)
            else:
                result = cursor.execute(query)
        except Exception as e:
            raise DBError()
        else:
            id = cursor.lastrowid
        finally:
            self.__connection.commit()
        return id

    def close(self):
        self.__connection.close()
