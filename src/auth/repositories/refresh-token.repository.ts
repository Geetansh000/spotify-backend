import { Injectable } from '@nestjs/common';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  revokeChain(token: string) {
    return this.manager.query(
      `UPDATE refresh_tokens SET revoked_at = IFNULL(revoked_at, NOW()) WHERE uuid IN (
	WITH RECURSIVE cte (uuid, token, replaced_by) AS (
		SELECT uuid, token, replaced_by
		FROM refresh_tokens
		WHERE token = "${token}"
		UNION ALL
		SELECT rt.uuid , rt.token, rt.replaced_by
		FROM refresh_tokens rt
		INNER JOIN cte
		ON rt.token = cte.replaced_by
	) SELECT uuid FROM cte
);`,
      [token],
    );
  }
}
