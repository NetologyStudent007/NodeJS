# 010-db

```
db.books.insertMany(
[
    {
        title: "Книга1",
        description: "Книга1",
        authors: "Автор2"
    },
    {
        title: "Книга2",
        description: "Книга2",
        authors: "Автор2"
    }
]
)
```

```
db.books.find( { title: "sometitle" } )
```

```
db.books.updateOne(
   { _id: "someid" },
   { $set: { description: "some desc", authors: "some authors" } }
)
```
