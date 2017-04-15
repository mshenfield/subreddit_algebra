from setuptools import setup, find_packages
# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='Subreddit Algebra App',
    version='0.1.0',
    description='A frontend to 538\'s analysis of subreddit similarity',
    long_description=long_description,
    url='https://github.com/mshenfield/subreddit_algebra',
    author='Max Shenfield',
    author_email='shenfieldmax@gmail.com',
    license='MIT',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: End Users/Desktop',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
    keywords='reddit 538 machine-learning',
    packages=find_packages(exclude=['frontend', 'bigquery']),
    install_requires=[
        'Flask',
        'Flask-Cors',
        # numpy and scikit-learn should be installed by other means
        'sklearn',
        'pandas',
        'marisa-trie',
    ],
    # $ pip install -e .[dev]
    extras_require={
        'dev': ['ipython', 'ipdb'],
    },
    package_data={
        'subreddit_algebra_app': ['static/'],
    },
)
