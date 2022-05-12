import mongoose from 'mongoose'

const connectDB = (url) => {
  return mongoose.connect(url)
  .then(() => console.log("DB CONNECTED"))
}
export default connectDB
