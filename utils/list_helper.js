const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
    const result = blogs.reduce((accumulator, item, index, array)=>{
        return accumulator + item.likes
    },0)
    return result
  }

  const favoriteBlog = (blogs) => {
    console.log("result")
    const result = blogs.reduce((accumulator, item, index, array)=>{
        return accumulator.likes > item.likes ? accumulator : item
    },{})
    const { title, author, likes } = result 
    const extractedBlog = { title, author, likes }    
    console.log(extractedBlog);    
    return extractedBlog
  }  

  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }