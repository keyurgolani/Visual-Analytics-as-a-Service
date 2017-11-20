def run_node(rdd, utils, params):
    import re
    def run_logic(row):
        row[params['column']:params['column'] + 1] = re.split(
            params['regex'], str(row[params['column']])) or []
        return row
    return rdd.map(run_logic)
