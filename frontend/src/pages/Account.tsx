import { memo } from 'react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useAuth } from "../hooks/useAuth.ts"

function Account() {

  const { submitSignup, submitLogin } = useAuth();

  return (
    <div className="flex justify-center items-center flex-grow">
    <div className="w-full h-full flex items-center justify-center">
      <Tabs defaultValue="signup" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Sign up now to make a public profile for game.
              </CardDescription>
            </CardHeader>
            <form className="" onSubmit={submitSignup}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input type="text" id="name" name="name" defaultValue="" />
                </div>
                <div className="space-y-1 pb-2">
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup name="gender" defaultValue="">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" id="username" name="username" defaultValue="" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" name="password" defaultValue="" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input type="password" id="confirmPassword" name="confirmPassword" defaultValue="" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Sign up</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login to use your personal account.
              </CardDescription>
            </CardHeader>
            <form className="" onSubmit={submitLogin}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="usernamelogin">Username</Label>
                <Input id="usernamelogin" name="usernamelogin" type="text" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="passwordlogin">Password</Label>
                <Input id="passwordlogin" name="passwordlogin" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Login</Button>
            </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}

export default memo(Account);