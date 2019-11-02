#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB


df = pd.read_csv('history.csv')

features = pd.DataFrame(df, columns=['title',"action"])





class NewsTittles:

    labels = [0, 1, 2]
    label_cat = ["down", "netruaal", "up"]

    def load(self,data):

        documents =[]
        learn_targets = []

        # iterate over the rows and append every row to the documents array
        for index, row in data.iterrows():
            documents.append(row['title'])
            learn_targets.append(row["action"])

        # count vectorizer of the documents
        count_vect = CountVectorizer()
        X_train_counts = count_vect.fit_transform(documents)
        # print(X_train_counts)

        # Term Freq
        tf_transformer = TfidfTransformer(use_idf=False).fit(X_train_counts)
        X_train_tf = tf_transformer.transform(X_train_counts)
        # print(X_train_tf.shape)


        # Term Frequency times Inverse Document Frequency
        tfidf_transformer = TfidfTransformer()
        X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
        # print(X_train_tfidf)



        clf = MultinomialNB().fit(X_train_tfidf, learn_targets)


        docs_new = [
            'Bitcoin’s Defense of Major Support May Fuel Price Bounce to $9,600',
        ]

        X_new_counts = count_vect.transform(docs_new)
        X_new_tfidf = tfidf_transformer.transform(X_new_counts)

        predicted = clf.predict(X_new_tfidf)

        for doc, category in zip(docs_new, predicted):
            print('%r => %s' % (doc, self.label_cat[category]))




a = NewsTittles()
a.load(features)

# a.print()


