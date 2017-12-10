def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Split Using Regex"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: Parameters passed from client for the Node
    :type params: dict
    :return: RDD with Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    import re

    def run_logic(row):
        """
        Logic to split given column using given regular expression and return
        the whole row with the column replaced
        :param row: each row to be passed to the function while mapping
        :type row: str or list
        :return: row after performing the operation
        :rtype: str or list
        """
        if type(row) == 'list':
            row[params['column']:params['column'] + 1] = re.split(
                params['regex'], str(row[params['column']])) or []
        else:
            row = re.split(params['regex'], row) or []
        return row
    return rdd.map(run_logic)
