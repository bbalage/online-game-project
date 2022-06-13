import { ActiveUser, User } from "../model/User";

export interface TokenSwitch {
    oldToken: string,
    newToken: string
}

export class ActiveAdminService {
    private static activeUserTokens: Map<string, ActiveUser> = new Map<string, ActiveUser>();

    public setAdmin(token: string, expiresIn: number, user: User) {
        this.removeAdmin(token);
        const activeUser: ActiveUser = {
            user: user,
            expiresAt: expiresIn + Math.floor(Date.now() / 1000)
        }
        ActiveAdminService.activeUserTokens.set(token, activeUser);
    }

    public getAdminName(token: string): string | null {
        if (!this.isAdminActive(token)) {
            return null;
        }
        const activeAdmin: ActiveUser | undefined = ActiveAdminService.activeUserTokens.get(token);
        if (activeAdmin === undefined) {
            return null;
        }
        return activeAdmin.user.username;
    }

    public getId(token: string): number | null {
        if (!this.isAdminActive(token)) {
            return null;
        }
        const activeUser: ActiveUser | undefined = ActiveAdminService.activeUserTokens.get(token);
        if (activeUser === undefined) {
            return null;
        }
        return activeUser.user.id;
    }

    public removeAdmin(token: string) {
        ActiveAdminService.activeUserTokens.delete(token);
    }

    public isAdminActive(token: string): boolean {
        const activeAdmin: ActiveUser | undefined = ActiveAdminService.activeUserTokens.get(token);
        if (activeAdmin === undefined) {
            return false;
        }
        if (this.isUserConnectionExpired(activeAdmin)) {
            this.removeAdmin(token);
            return false;
        }
        return true;
    }

    public isUserConnectionExpired(activeAdmin: ActiveUser): boolean {
        return activeAdmin.expiresAt < Math.floor(Date.now() / 1000);
    }
}