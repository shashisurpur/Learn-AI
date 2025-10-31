import mongoose from 'mongoose';

const EmbeddingSchema = new mongoose.Schema({
  text: String,
  embedding: [Number], // store the vector
});

const MongoosEmbedding= mongoose.models.Embedding || mongoose.model('Embedding', EmbeddingSchema);

export default MongoosEmbedding