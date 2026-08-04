import pandas as pd

df = pd.read_excel("../Invitados.xlsx", header=1)

print(df.columns)

print(df.head())