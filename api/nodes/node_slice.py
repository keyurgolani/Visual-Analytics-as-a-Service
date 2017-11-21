def run_node(rdd, utils, params):
    def run_logic(row):
        row[params['column']] = row[
            params['column']][params['start']:params['end'] + 1]
        return row
    return rdd.map(run_logic)
