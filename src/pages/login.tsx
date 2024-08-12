import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getToken, loginAPI } from "@/components/api/authApi";
import { useToast } from "@/components/ui/use-toast";
import InputOTPForm from "./InputOtpForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [otpValidate, setOtpValidate] = useState(false);

  const [id, setId] = useState("");

  const formSchema = z.object({
    username: z.string().min(2).max(50).trim(),
    password: z.string().min(4).max(50).trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await loginAPI(values);
      setUsername(values.username);
      console.log(response);
      
      setId(response.data.uniqueId);
      setOtpValidate(true);
      toast({
        title: "Authentication",
        description: "Login successful",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Authentication",
        description: "",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    
    if (getToken()) navigate("/");
  }, []);

  return (
    <div className="h-full">
      {otpValidate ? (
        <InputOTPForm id={id} userName={username} />
        
      ) : (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="w-1/2 sm:w-2/5 lg:w-1/4">
            <p className="py-6 text-3xl font-extrabold text-center">OTRS.</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Login</Button>

                <div className="flex items-center justify-center gap-1">
                  <p className="text-muted-foreground text-xs">Made with ❤️</p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
