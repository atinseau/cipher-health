import { AdminService } from "@/adapters/admin/admin.service";
import { HttpStatus, Injectable } from "@nestjs/common";
import { z } from "zod";
import { profileCreationSchema } from "../profile.schema";
import { IStwt, UserModel } from "@/types";
import { createHttpError } from "@/utils/errors";
import { clientMedicalInformationSchema } from "@cipher-health/utils/schemas";


@Injectable()
export class ProfileService {

  constructor(
    private readonly adminService: AdminService,
  ) {}

  async createAdminProfile(data: z.infer<typeof profileCreationSchema>, user: UserModel, stwt: IStwt) {
    const result = await this.adminService.createAdmin({
      profile: data,
      admin: {
        // if permissions is provided in stwt data, use it, otherwise use empty array
        permissions: stwt.data?.permissions || [],
        // if creatorId is provided in stwt data, use it, otherwise use null
        // TODO: check if creatorId is a valid user id and throw an error if not
        creatorId: stwt.data?.creatorId || null,
      },
      user
    })
    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND,
        // The next errors should never happen because user is already created
        // and verified, it's a side effect of "createAdmin" method that can also
        // create a user if it doesn't exist
        DUPLICATE_PHONE: HttpStatus.INTERNAL_SERVER_ERROR,
        DUPLICATE_EMAIL: HttpStatus.INTERNAL_SERVER_ERROR,
        PHONE_FORMAT_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
    return {
      success: true,
      data: result.data
    }
  }

  async createClientProfile(
    data: z.infer<typeof profileCreationSchema> & z.infer<typeof clientMedicalInformationSchema>,
    user: UserModel
  ) {
    console.log('createClientProfile', data)
    return {
      success: true,
      data
    }

  }

}