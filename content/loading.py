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
        data = pd.DataFrame(df, columns=['title', 'action'])

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

    def vote(self, username, title, vote):
        clf = load('classifier.joblib')

        X = clf.named_steps['vect'].fit_transform([title])
        X = clf.named_steps['tfidf'].fit_transform(X)

        updated_clf = clf.named_steps['clf'].partial_fit(X, [vote])

        dump(updated_clf, 'classifier.joblib')


a = NewsTittles()
a.train()

docs_new = [
    'Trump’s Defense of Major Support May Fuel Price Bounce to $8,600',
]
a.classify(docs_new)

a.vote("vesi", "Trump still divided over decision to release Ukraine", 2)
a.vote("vesi", "Live updates: Trump impeachment inquiry", 2)
a.vote("vesi", "Why President Trump's move from New York to Florida could", 2)

a.classify(docs_new)

# a.print()


