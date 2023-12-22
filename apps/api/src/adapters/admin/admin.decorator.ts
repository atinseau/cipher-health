import { Reflector } from "@nestjs/core";


/**
 * This decorator is used to mark a route that requires the 
 * admin profile should be exist in the user object.
 * 
 * If the admin profile is not exist, the route will throw an error.
 */
export const RequiredAdmin = Reflector.createDecorator()
