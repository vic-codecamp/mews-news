#!/usr/bin/python3

import pandas as pd

df = pd.read_csv('history.csv')

features = pd.DataFrame(df, columns=['title'])
print(features)
