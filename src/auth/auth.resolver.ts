import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { SignUpResponse } from './dto/sign-up.response';
import { SignInResponse } from './dto/sign-in.response';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Public()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpResponse, { name: 'SignUp' })
  signUp(@Args('input') input: SignUpInput): Promise<SignUpResponse> {
    return this.authService.signUp(input);
  }

  @Mutation(() => SignInResponse, { name: 'SignIn' })
  signIn(@Args('input') input: SignInInput): Promise<SignInResponse> {
    return this.authService.signIn(input);
  }
}
