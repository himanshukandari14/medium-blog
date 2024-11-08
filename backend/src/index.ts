
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt';


const app = new Hono<{ 
  Bindings: {
    DATABASE_URL:string
    JWT_SECRET: string
  };
}>();


// middleware
app.use('api/v1/blog/*',async (c,next)=>{
  // get the header
  // verify header
  // if header is correct,we need can proceed
  // if not we rteun the user a 403 syayus code
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  const response = await verify(header,c.env.JWT_SECRET)
  if(response.id){
     next() 
  }else{
    c.status(403);
    return c.json({
      error:"You are not authorized to access this resource"
    })
  }
})

app.post('/api/v1/signup', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,

  }).$extends(withAccelerate())
  const body = await c.req.json();

  const user = await prisma.user.create({
    data:{
      email:body.email,
      password:body.password
    }
  })

  const token = await sign({id:user.id},c.env.JWT_SECRET)
  return c.json({
    jwt: token
  })

})


app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({
    jwt: token,
  });
});


app.put("/api/v1/blogs", (c) => {
return c.text("hello");
});

app.get('/api/v1/blogs',(c)=>{
  
   return c.text("user");
  
})
app.get("/api/v1/blog/:id", (c) => {
  
   return c.text("user");
});

export default app
