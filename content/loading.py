#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from joblib import dump, load


class NewsTittles:

    labels = [0, 1, 2]
    label_cat = ["down", "netruaal", "up"]


    def load_csv(self):
        df = pd.read_csv('history.csv')
        data = pd.DataFrame(df, columns=['title', "action"])

        documents =[]
        learn_targets = []

        # iterate over the rows and append every row to the documents array
        for index, row in data.iterrows():
            documents.append(row['title'])
            learn_targets.append(row["action"])
        return documents, learn_targets

    def train(self):
        documents, learn_targets = self.load_csv()

        text_clf = Pipeline([
            ('vect', CountVectorizer()),
            ('tfidf', TfidfTransformer()),
            ('clf', MultinomialNB()),
        ])

        # fit pipeline
        clf = text_clf.fit(documents, learn_targets)

        # persist trained pipeline
        dump(clf, 'classifier.joblib')

    def classify(self, titles):
        clf = load('classifier.joblib')

        predicted = clf.predict(titles)

        for doc, category in zip(docs_new, predicted):
            print('%r => %s' % (doc, self.label_cat[category]))




a = NewsTittles()
a.train()

docs_new = [
    'Bitcoin’s Defense of Major Support May Fuel Price Bounce to $8,600',
]
a.classify(docs_new)

# a.print()


