def run_node(rdd, utils, params):
    import re
    def run_logic(row):
        regex_match = re.match()
        row[params.column] = regex_match.findall(
            params.regex, str(row[params.column])) or []
        return row
    return rdd.map(run_logic)
