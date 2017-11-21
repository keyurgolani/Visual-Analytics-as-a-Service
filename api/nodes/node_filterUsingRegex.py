def run_node(rdd, utils, params):
    import re
    def run_logic(row):
        return re.match(params['regex'], row[params['column']])
    return rdd.map(run_logic)
