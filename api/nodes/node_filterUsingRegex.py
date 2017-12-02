def run_node(rdd, utils, params):
    """
    Logic for Node "Filter With Regex"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param params: parameters passed from client for current Node
    :type params: dict
    :return: RDD with filter Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    import re
    def run_logic(row):
        """
        Logic to find weather the row fits the regex passed in the params
        from client and return True or False
        :param row: each row to be passed to the function while mapping
        :type row: list
        :return: True or False based on given regex and row
        :rtype: boolean
        """
        return re.match(params['regex'], row[params['column']])
    return rdd.map(run_logic)
