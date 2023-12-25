

import prismadb from "@/lib/prismadb";
import { CompanionForm } from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";




interface CompanionProps {
  params: {
    companionId: string;
  }
};


const page: React.FC<CompanionProps> = async ({ params }) => {

  const { userId } = auth()
  
  if (!userId) { 
    return redirectToSignIn();
  }
 
  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId
    }
  }) 

  const categories = await prismadb.category.findMany();
  
  return (
    <CompanionForm
      initialData={companion}
      categories={categories}
    />
  )
}

export default page