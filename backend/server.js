import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
// import products from './data/products.js'
import colors from 'colors'
import productRoute from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'
import chalk from 'chalk'
import uploadRoute from './routes/uploadRoute.js'
import morgan from 'morgan'


dotenv.config();

connectDB() 

const app=express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }

app.use(express.json())  // Accept JSON data in the  body





 
app.use('/api/products',productRoute)
app.use('/api/users',userRoute)
app.use('/api/orders',orderRoute)
app.use('/api/upload', uploadRoute)

app.get('/api/config/paypal', (req, res)=> {
    res.send(process.env.PAYPAL_CLIENT_ID)
})


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if ((process.env.NODE_ENV = 'production')) {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} 
else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}



const PORT=process.env.PORT || 5000
  
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}! & is in ${process.env.NODE_ENV} mode.`.yellow.inverse);    
});   