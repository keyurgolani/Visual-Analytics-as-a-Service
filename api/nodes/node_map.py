def run_node(rdd, utils, logic):
    """
    Logic for Node "Map"
    :param rdd: Input RDD To Be Appended Node Logic To
    :type rdd: SparkRDD
    :param utils: Utils module object to access Utility functions from
    :type utils: Module
    :param logic: Logic passed from client side to be interpreted as
    pre-formatted code
    :type logic: raw str
    :return: RDD with map Logic of current Node appended to it.
    :rtype: SparkRDD
    """
    logic_id = utils.write_to_file(logic)
    import importlib
    code_module = importlib.import_module(logic_id.rstrip(".py").replace(
        "/", "."))
    return rdd.map(code_module.run_logic)
