#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB


df = pd.read_csv('history.csv')

features = pd.DataFrame(df, columns=['title'])





class NewsTittles:

    labels = [0, 1, 2,3,4,5,6,7,8,9]
    label_cat = ["down", "netruaal", "up"]

    def load(self,data):

        documents =[]

        # iterate over the rows and append every row to the documents array
        for index, row in data.iterrows():
            documents.append(row['title'])

        # count vectorizer of the documents
        count_vect = CountVectorizer()
        X_train_counts = count_vect.fit_transform(documents)
        print(X_train_counts)

        # Term Freq
        tf_transformer = TfidfTransformer(use_idf=False).fit(X_train_counts)
        X_train_tf = tf_transformer.transform(X_train_counts)
        print(X_train_tf.shape)

        # Term Frequency times Inverse Document Frequency
        tfidf_transformer = TfidfTransformer()
        X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
        print(X_train_tfidf.shape)



        clf = MultinomialNB().fit(X_train_tfidf, self.labels)


        docs_new = [
            'A disgraced Tor developer has resurfaced to testify against one of his accusers',
            'Sign Up for Your Free Year of Apple TV+ Right Now'
        ]

        X_new_counts = count_vect.transform(docs_new)
        X_new_tfidf = tfidf_transformer.transform(X_new_counts)

        predicted = clf.predict(X_new_tfidf)

        for doc, category in zip(docs_new, predicted):
            print(doc)
            print(category)
            # print('%r => %s' % (doc, self.label_cat[category]))
            # print('%r => %s' % (doc, self.label_cat[category]))



a = NewsTittles()
a.load(features)

# a.print()


