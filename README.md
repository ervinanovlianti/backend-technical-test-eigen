# RESTFul API Library
Description: This project uses NodeJS with ExpressJS & uses a No-SQL database (MongoDB). Implement model, controller, & unit testing.

## Entities
-  Member
-  Book

## Usecase
- Members can borrow books with conditions
  - Members may not borrow more than 2 books
  - Borrowed books are not borrowed by other members
  - Member is currently not being penalized
- Member returns the book with conditions
   - The returned book is a book that the member has borrowed
- Check the book
   - Shows all existing books and quantities
   - Books that are being borrowed are not counted
- Member check
  - Shows all existing members
  - The number of books being borrowed by each member
## Mock Data
- Books
```
[
    {
        code: "BK-001",
        title: "New Book 1",
        author: "Author 1",
        stock: 2
    },
]
```
- Members
```
[
    {
        code: "M-001",
        name: "Ervina"
    },
]
```
## Endpoint
-   Book API
    - ```GET /api/books```
     retrieve all books
    - ```POST /api/books```
     add a new book & not add a book without the required fields
    - ```GET /api/books/:code```
     retrieve a book by code & return an error for a non-existent book code
    - ```PUT /api/books/:code```
     update a book by code
    - ```DELETE /api/books/:code```
     delete a book by Cod
     
-
    Member API
    - ```GET /api/members```
    retrieve all members
    - ```POST /api/members```
    add a new member & not add a member without the required fields
    - ```GET /api/members/:code```
    retrieve a member by code
    - ```PUT /api/members/:code```
    update a member by code
    - ```DELETE /api/members/:code```
    delete a member by code
    - ```POST /api/members/:code/borrow```
    allow to borrow a book with the condition that the member is not allowed to borrow more than 2 books and is not allowed to borrow an already borrowed book
    - ```POST /api/members/:code/return```
   allow returning a book with a condition: not allow returning a book that does not belong to them & return an error for a non-existent member

