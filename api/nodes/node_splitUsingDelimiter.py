def run_node(rdd, utils, params):
    def run_logic(row):
        row[params['column']:params['column'] + 1] = row[
            params['column']].split(params['delimeter']) or []
        return row
    return rdd.map(run_logic)
