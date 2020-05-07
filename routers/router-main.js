const express = require('express');

const db = require('../data/db');

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {

    console.log(req.query);
    db.find(req.query)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(error => {
      
        console.log(error);
        res.status(500).json({
          message: "Error retrieving the db"
        });
      });
  });

  router.get("/:id/comments", (req, res) => {
    const postId = req.params.id;

    db.findPostComments(postId)
      .then(comments => {
        if (!postId) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else {
          res.status(200).json(comments);
        }
      })
      .catch(error => {
        console.log(error);
        res
          .status(500)
          .json({ error: "The comments information could not be retrieved." });
      });
  });

router.get("/:id", (req, res) => {
    const id = req.params.id

    db.findById(id)
    .then(post => {
        if(post) {
            res.status(200).json(post);
        }
        res.status(404).json({ errorMessage: "id could not be returned"})
    })
    .catch(error => {
        console.log(error);
            res.status(500).json({
                errorMessage: "Could not retrieve the database"
            })
    })
})

router.post('/', (req, res) => {
    const {title, contents} = req.body

    if(!title || !contents){
        res.status(400).json({errorMessage: "Please provide a title and some contents"})
    }
    db.insert({title, contents})
    .then(post => {
        res.status(201).json(post)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            errorMessage: "Could not add the message"
        })
    })
})

router.post("/:id/comments", (req, res) => {
    const { text, post_id } = req.body;
  
    db.insertComment(req.body)
      .then(newComment => {
        if (!post_id) {
          return res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else if (!text) {
          return res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          res.status(201).json(newComment);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  });

router.delete('/:id', (req,res) => {
    const id = req.params.id

    db.remove(id)
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: "The post has been deleted" })  
        }
        res.status(404).json({ message: "Post not found" });
    })
    .catch(error => {
        res.status(500).json({
            message: "Error removing the post"
        })
    })
})

router.put("/:id", (req, res) => {
    const updateId = req.params.id;
    const { title, contents } = req.body;

    db.update(updateId, req.body)
        .then(updated => {
            if (!title || ! contents) {
                res.status(400).json({
                    error: "Please provide title and contents for the post."
                })
            } else if (!updateId) {
                res.status(404).json({
                    error: "The post with the specified ID does not exist."
                })
            } else {
                console.log(updated);
                res.status(200).json(updated);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be modified." })
        })
        db.findById(updateId)
        .then(res.json(req.body))
        .catch(error => {
          console.log(error);
          res
            .status(500)
            .json({ error: "The post information could not be modified." });
        });

})

module.exports = router;
