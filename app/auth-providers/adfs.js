/**
 * Configures Active Directory Federation Services as a NextAuth provider.
 */
export const ADFS = (options) => {
    return {
        id: "adfs",
        name: "eIAM (ADFS)",
        type: "oauth",
        authorization: {
            url: options.authorizeUrl,
            params: {
                scope: "openid",
            },
        },
        idToken: true,
        async profile(profile, tokens) {
            // Usually the user only has one role, which is a string.
            let role = profile.role;
            if (Array.isArray(profile.role)) {
                // In rare occasions where the user has multiple roles,
                // the 'Admin' role is the leading role.
                const opRole = profile.role.find((x) => x == "Admin");
                // If the user has the 'Admin' role, this will be the assigned role.
                if (opRole != undefined) {
                    role = opRole;
                }
                // Otherwise, take the first occurrence in the list.
                else {
                    role = profile.role[0];
                }
            }
            return {
                id: profile.sub,
                name: `${profile.given_name} ${profile.family_name}`,
                email: profile.email,
                role: role,
                idToken: tokens.id_token,
            };
        },
        options,
    };
};
