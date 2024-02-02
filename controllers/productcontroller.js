import multer from "multer";
import path from "path";
import allcustomErrorHandler from "../services/customerrhandler.js";
import Joi from "joi";
import product from "../model/product.js";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const handelallfile = multer({
    storage, limits: { fileSize: 1000000 * 50 }
}).single('image');


const ProductController = {
    async productstore(req, res, next) {
        // Multiple Data:
        handelallfile(req, res, async (err) => {
            if (err) {
                return next(allcustomErrorHandler.serverError(err.message));
            }
            console.log(req.file);
            // filepath:
            const filepath = req.file.path;

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required()
            })

            const { error } = productSchema.validate(req.body);

            // Validation Fail thay to Delete the upload image:
            if (error) {
                fs.unlinkSync(`${AppRoot}/${filepath}`, () => {
                    return next(allcustomErrorHandler.serverError(err.message));
                })

                return next(error);
            }

            const { name, price, size } = req.body;

            let document;
            try {
                document = await product.create({
                    name,
                    price,
                    size,
                    image: filepath
                });


            }
            catch (err) {
                return next(err);
            }
            res.json({ product_details: document });
        })

    },
    // Update:
    async update(req, res, next) {

        // Multiple Data:
        handelallfile(req, res, async (err) => {
            if (err) {
                return next(allcustomErrorHandler.serverError(err.message));
            }
            console.log(req.file);
            // filepath:
            let filepath;
            if (req.file) {
                filepath = req.file.path;
            }

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required()
            })

            const { error } = productSchema.validate(req.body);

            // Validation Fail thay to Delete the upload image:
            if (error) {
                if (req.file) {
                    fs.unlinkSync(`${AppRoot}/${filepath}`, () => {
                        return next(allcustomErrorHandler.serverError(err.message));
                    })
                }

                return next(error);
            }

            const { name, price, size } = req.body;

            let updatedocument;
            try {
                updatedocument = await product.findByIdAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    image: filepath
                });


            }
            catch (err) {
                return next(err);
            }
            res.json({ updatedocument: updatedocument });
        })

    },
    // Delete:
    async delete(req, res, next) {

        const deletedocument = await product.findByIdAndDelete({ _id: req.params.id });

        if (!deletedocument) {
            return next(new Error("Nothing to Delete...."));
        }

        // Image Delete:
        const imagepath = deletedocument.image;

        fs.unlinkSync(`${AppRoot}/${imagepath}`, () => {
            return next(allcustomErrorHandler.serverError());
        })

        res.json(deletedocument);
    },
    // Show:
    async show(req, res, next) {

        let showdocument;
        try {
            showdocument = await product.find({});
        }
        catch (err) {
            return next(allcustomErrorHandler.serverError());
        }

        res.json(showdocument);

    },
    // ShowSingle:
    async showsingle(req, res, next) {

        let showsingledocument;
        try {
            showsingledocument = await product.findOne({ _id: req.params.id });
        }
        catch (err) {
            return next(allcustomErrorHandler.serverError());
        }

        res.json(showsingledocument);

    }
}

export default ProductController;