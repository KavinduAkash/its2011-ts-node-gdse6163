import mongoose, {ObjectId} from "mongoose";

interface IArticle extends mongoose.Document {
    title: string,
    description: string,
    publishedDate: Date,
    user: ObjectId
}

const ArticleSchema = new mongoose.Schema<IArticle>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishedDate: {type: Date, required: true, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
})

const ArticleModel = mongoose.model('Article', ArticleSchema);
export default ArticleModel;