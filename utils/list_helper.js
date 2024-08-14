const dummy = (blogs) => {
    // ...
    return 1
  }

  const totalLikes = (blogs) => {
    // ...
    const result = blogs.reduce((accumulator, item, index, array)=>{
        return accumulator + item.likes
    },0)
    return result
  }

  
  module.exports = {
    dummy,
    totalLikes
  }