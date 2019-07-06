import numpy as np
import pandas as pd
import sqlite3

from flask import Flask, jsonify, render_template


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################


# database_path = "NYC_Health_Ratings.sqlite"
# engine = create_engine(f'sqlite:///{database_path}')

# ['NYC_Health_Ratings',
#  'Restaurant_Geo_Info',
#  'Violations_by_Borough',
#  'Violations_by_Cuisine',
#  'Violations_by_Restaurant']



@app.route("/")
def welcome():
    """List all available api routes."""
    #return ("Available Routes:/api/v1.0/location<br>\n/api/v1.0/id<br>\n/api/v1.0/user_smart/<input_column>")
    return render_template("index.html") 

@app.route("/api/v1.0/user_smart/<input_column>")
def mycolumn(input_column):
    conn = sqlite3.connect("NYC_Health_Ratings.sqlite")
    cur = conn.cursor()
    cur.execute("SELECT * from Restaurant_Geo_Info")
    rows = cur.fetchall()
    column_list = []
    for row in rows:
        column_list.append(row[0])

    columndata = dict()
    columndata["column name"] = input_column
    columndata["result"] = column_list
    return jsonify(columndata)


@app.route("/api/v1.0/Locations")
def mylocations():
    conn = sqlite3.connect("NYC_Health_Ratings.sqlite")

    cur = conn.cursor()
    cur.execute("SELECT lat, long from Restaurant_Geo_Info")
    rows = cur.fetchall()
    lat_list = []
    # long_list = []
    for row in rows:
        lat_list.append(row[0])
        # long_list.append(row[1])

    return jsonify(lat_list)
    # return jsonify(long_list)

# Query the database and return the jsonified results for the heat map
@app.route("/heatData")
def heatData():
    conn = sqlite3.connect("NYC_Health_Ratings.sqlite")
    cur = conn.cursor()

    cur.execute("select dba, lat, long from Restaurant_Geo_Info")
    results = cur.fetchall()
    df = pd.DataFrame(results, columns=['nameDBA', 'lat', 'long'])
    return jsonify(df.to_dict(orient="records"))

# Query the database and return the jsonified results for the simple Markers map
@app.route("/markerData")
def markerData():
    conn = sqlite3.connect("NYC_Health_Ratings.sqlite")
    cur = conn.cursor()
    cur.execute("select * from Restaurant_Markers")
    results = cur.fetchall()
    df = pd.DataFrame(results, columns=['DBA', 'BORO', 'CUISINE DESCRIPTION', 'GRADE', 'address_full', 'lat','long', 'Count of Violations'])
    return jsonify(df.to_dict(orient="records"))

# Query the database and return the jsonified results for the full restaurant list
@app.route("/tabularData")
def tabularData():
    conn = sqlite3.connect("NYC_Health_Ratings.sqlite")
    cur = conn.cursor()
    cur.execute("select DBA, BORO, [CUISINE DESCRIPTION], [VIOLATION CODE], [VIOLATION DESCRIPTION], [CRITICAL FLAG], GRADE from NYC_Health_Ratings limit 10")
    results = cur.fetchall()
    df = pd.DataFrame(results, columns=['DBA', 'BORO', 'CUISINE DESCRIPTION', 'VIOLATION CODE', 'VIOLATION DESCRIPTION', 'CRITICAL FLAG', 'GRADE'])
    
    # Build options argument containing column and data
    # columns are dataframe headers
    # data is result rows in list format
    # options should be a dictionary containing a list of lists
    options = {
        "columns": df.columns.values.tolist(),
        "results": df.values.tolist()
    }
    
    return jsonify(options)
    # return jsonify(df.to_dict(orient="records"))

# @app.route("/api/v1.0/location")
# def location():
#     conn = sqlite3.connect("NYC_Health_Ratings.sqlite")
#     cur = conn.cursor()
#     cur.execute("SELECT * from Violations_by_Cuisine")
#     rows = cur.fetchall()
#     location_list = []
#     for row in rows:
#         location_list.append(row[0])

#     return jsonify(location_list)

if __name__ == '__main__':

#######################################################
# queries on the data - sanity checks
#######################################################

#understand tables in schema
    conn = sqlite3.connect("NYC_Health_Ratings.sqlite")
    cur = conn.cursor()
    sqlFortableNames = "SELECT name FROM sqlite_master WHERE type='table'"
    cur.execute(sqlFortableNames)
    results = cur.fetchall()
    print("---Tables in the NYC_Health_Ratings sqlite file")
    print(results)

 #get the columns in the Restaurant_Geo_Info table
    sqlForColumnNames = "SELECT sql FROM sqlite_master WHERE name='Restaurant_Geo_Info'"
    cur.execute(sqlForColumnNames)
    results = cur.fetchall()
    print("------------")
    print("---Columns in Restaurant_Geo_Info") 
    print(results)

 #get the columns in the Violations_by_Restaurant table
    sqlForColumnNames = "SELECT sql FROM sqlite_master WHERE name='Violations_by_Restaurant'"
    cur.execute(sqlForColumnNames)
    results = cur.fetchall()
    print("------------")
    print("---Columns in Violations_by_Restaurant") 
    print(results)
    
    #get the columns in the Restaurant_Markers table
    sqlForColumnNames = "SELECT sql FROM sqlite_master WHERE name='Restaurant_Markers'"
    cur.execute(sqlForColumnNames)
    results = cur.fetchall()
    print("------------")
    print("---Columns in Restaurant_Markers")
    print(results)

    #get the columns in the NYC_Health_Ratings table
    sqlForColumnNames = "SELECT sql FROM sqlite_master WHERE name='NYC_Health_Ratings'"
    cur.execute(sqlForColumnNames)
    results = cur.fetchall()
    print("------------")
    print("---Columns in NYC_Health_Ratings")
    print(results)

app.run(debug=True)
