# #!/usr/bin/env python3

# import pandas as pd
# import mysql.connector

# # Read the CSV
# csv_file = "2026 holy half - Sheet1.csv"
# df = pd.read_csv(csv_file, sep=',')  # CSV is comma-separated
# df.columns = df.columns.str.strip()  # Clean up any extra spaces

# # Connect to the database
# conn = mysql.connector.connect(
#     host="localhost",
#     user="mleal2",
#     password="Bepagy09_",
#     database="mleal2"
# )
# cursor = conn.cursor()

# # Create the INSERT query
# insert_query = """
# INSERT INTO orders 
# (first_name, last_name, grade, listing_id, event_name, size, qty, paid)
# VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
# """

# # Loop through the DataFrame and insert rows
# for index, row in df.iterrows():
#     first_name = row['FirstName'] if pd.notna(row['FirstName']) else 'no name'
#     last_name = row['LastName'] if pd.notna(row['LastName']) else 'no name'
#     grade = row['Grade'] if pd.notna(row['Grade']) else 'no grade'
#     listing_id = int(row['ListingID'])
#     event_name = row['EventName'] if pd.notna(row['EventName']) else 'no name'
#     size = row['Size'] if pd.notna(row['Size']) and row['Size'] != '' else 'none'
#     qty = int(row['qty'])
#     paid = float(row['Paid'])
    
#     cursor.execute(insert_query, (first_name, last_name, grade, listing_id, event_name, size, qty, paid))

# # Commit and close
# conn.commit()
# cursor.close()
# conn.close()

# print("CSV data inserted successfully!")

#!/usr/bin/env python3
import mysql.connector

# Connect to the database
conn = mysql.connector.connect(
    host="localhost",
    user="mleal2",
    password="Bepagy09_",
    database="mleal2"
)
cursor = conn.cursor()

with open("./notre_dame.png", "rb") as f:
    img = f.read()

cursor.execute(
    "UPDATE organizations SET image = %s WHERE id = 8",
    (img,)
)
conn.commit()
cursor.close()
conn.close()