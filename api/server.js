// IMPORTS AT THE TOP
const express = require('express');
const Dog = require('./dog-model')

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS
// [GET]    /             (Hello World endpoint)
server.get('/hello-world', (req, res) => {
    res.status(200).json({message: "Hello, this is God. What do you want?"})
})

// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get('/api/dogs', async (req, res) => {
   try {
        const dogs = await Dog.findAll()
        res.status(200).json(dogs)
   } catch(err) {
        res.status(500).json({ message: `Woof woof, no dogs here. ${err.message}` })   
   }
})

// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get('/api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dog = await Dog.findById(id);

        if (!dog) {
            res.status(404).json({ message: `no dog w/ an id of ${id}`})
        } else res.status(200).json(dog)        
    } catch(err) {
         res.status(500).json({ message: `Woof woof, dog ${req.params.id} not here. ${err.message}` })   
    }
 })


// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post('/api/dogs', async (req, res) => {
    try {
        const { name, weight } = req.body;
        if (!name || !weight) {
            res.status(422).json({
                message: 'name and weight are required to create a dog!'
            })
        } else {
            const createdDog = await Dog.create({ name, weight });
            res.status(201).json({
                message: "Woof Woof, a new dog has been created.",
                data: createdDog
            })
        }
    } catch(err) {
         res.status(500).json({ message: `Woof woof, cannot create dog.` })   
    }
 })

// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put('/api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, weight } = req.body;
        if (!name || !weight) {
            res.status(422).json({
                message: 'name and weight are required to create a dog!'
            })
        } else {
            const updatedDog = await Dog.update(id, {name, weight})   
            
            if (!updatedDog) {
                res.status(404).json({
                    message: `Dog with ${id} not found`
                })
            } else {
                res.status(200).json({
                    message: "Dog updated",
                    data: updatedDog
                })
            }
        } 
    }
    catch (err) {
        res.status(500).json({
            message: `Error updating dog ${req.params.id}`
        })
    }
})

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete("/api/dogs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDog = await Dog.delete(id);
        const dogs = await Dog.findAll()
        if (!deletedDog) {
            res.status(404).json({
                message: `Dog with id ${id} not found`
            })
        } else {
            res.status(200).json({
                message: `Dog ${id} has been obliterated`,
                data: dogs
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: `Error udpating dog ${err.message}`
        })
    }
})


// EXPOSING THE SERVER TO OTHER MODULES 
module.exports = server
