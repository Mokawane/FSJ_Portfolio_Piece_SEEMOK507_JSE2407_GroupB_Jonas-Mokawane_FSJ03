import Products from "@/components/Products";
import Search from "@/components/Search";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm";

export default function Home() {
  return (
    <div>
      <main>
      <h1 className="text-center text-2xl font-bold mb-6">Welcome to Our Store</h1>
      <div className="flex justify-center m-4">
         <Search />
      </div>
          <SignUpForm />
          <SignInForm />
         <Products />
      </main>
      <footer>
      </footer>
    </div>
  );
}
