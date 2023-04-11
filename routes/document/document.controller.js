const { Document } = require("../../models/documents");
const mongoose = require('mongoose')



async function getDocuments(req, res) {
  
    let {id} = req.query;
    console.log("iddd", id)
    try {
        const result = await Document.find({userId: id});
        res.status(200).json({
            success: true,
            result: result
        })
    } catch (err) {
        console.log(err)
        res.status(409).json({
            success: false,
            message: err
        })
    }
}

async function postDocuments(req, res) {
    console.log( req.query.id, "req", req.body,"file", req.file)
    const { name, description } = req.body;
    const {id} = req.query

    try {

        const check = await Document.findOne({ name: name, userId:id })
        
        if (check) {
            console.log( "check", check);       
                 return res.status(409).json({
                success: false,
                message: "Data with Already Present with name:- " + name
            })
        }
        if (name && description && req.file) {
            console.log("2")
            const data = {
                userId :id,
                name: name,
                description: description,
                document: req.file.path
            }
            const result = await Document.create(data);
            console.log("data", data, "result", result)
            return res.status(200).json({
                success: true,
                message: "Document Added Successfully",
                result: result
            })
        } else {
            console.log("3")
            return res.status(404).json({
                success: false,
                message: "Data Not Found"
            })
        }
    } catch (err) {

        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function editDocument(req, res) {
    const { name, description, id } = req.body;
    console.log(id)

    try {
        let data = {}
        if (req.file) {
            data = {
                name: name,
                description: description,
                document: req.file.path
            }
        } else {

            data = {
                name: name,
                description: description,
            }
        }
        console.log(data)
        const result = await Document.findOneAndUpdate({ _id: id }, data, {
            new: true
        })
        return res.status(200).json({
            success: true,
            message: "Data Updated Successfully",
            result: result
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function deleteDocument(req, res) {
    try {
        const { id } = req.query;
        console.log(id)
        // Check if ID is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }
        const result = await Document.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Document deleted successfully",
            result: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}



module.exports = { getDocuments, postDocuments, editDocument, deleteDocument }