def run_node(rdd, utils, params, parked):
    """
    Logic for Node "Extract With Regex"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    import re

    def run_logic(row):
        """
        Logic to extract values from given column using given regex in params
        from client and return the row replacing the column
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: row with the given column replaced with processed row
        :rtype: list
        """
        if type(row) == 'list':
            col = int(params['column'])
            row[col:col + 1] = re.findall(params['regex'], str(row[col])) or []
        else:
            row = re.findall(params['regex'], row) or []
        return row
    return rdd.map(run_logic)
