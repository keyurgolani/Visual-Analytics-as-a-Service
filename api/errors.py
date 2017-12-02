class DBError(Exception):
    """
    Error class to be raised when any database related error occurs.
    """
    def __init__(self):
        pass


class MoreThanOneResultError(Exception):
    """
    Error class to be raised when one ID fetches more than one results from
    database
    """
    def __init__(self):
        pass


class UnimplementedOperationError(Exception):
    """
    Error class to be raised when any unsupported operation is tried to be
    executed
    """
    def __init__(self):
        pass
