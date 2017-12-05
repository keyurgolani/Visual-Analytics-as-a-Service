import pymysql.cursors
import pymysql
import errors


class DbHelper(object):
    """
    Class to help with the Database operations and connections.
    This class defines the connection with the database and provides sample
    methods to be executed with the ready query strings for basic CRUD
    operations.
    """
    __connection = None
    __cursor = None

    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = "admin"
    DB = "VAAAS"

    def __init__(self):
        """
        Initializes the connection to the database according to the
        parameters given
        """
        self.__connection = pymysql.connect(
            host=self.DB_HOST,
            user=self.DB_USER,
            password=self.DB_PASSWORD,
            db=self.DB,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

    def query(self, query, params=None):
        """
        Method provides the READ operation out of CRUD
        :param query: SQL Query to be executed
        :param params: conditional parameters for the READ operation
        :return: Dictionary of all READ data.
        """
        print "========================Query==========================="
        print query
        print "========================================================"
        cursor = self.__connection.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        return cursor.fetchall()

    def insert(self, query, params=None):
        """
        Method provides the CREATE operation out of CRUD
        :param query: SQL Query to be executed
        :param params: values for the CREATE operation
        :return: ID of the inserted row into database
        """
        print "========================Query==========================="
        print query
        print "========================================================"
        cursor = self.__connection.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
        except Exception as e:
            # raise errors.DBError(e)
            raise e
        else:
            id = cursor.lastrowid
        finally:
            self.__connection.commit()
        return id

    def close(self):
        self.__connection.close()
