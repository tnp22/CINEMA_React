package com.aloha.movieproject.provider;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.aloha.movieproject.constants.SecurityConstants;
import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.UserAuth;
import com.aloha.movieproject.domain.Users;
import com.aloha.movieproject.mapper.UserMapper;
import com.aloha.movieproject.props.JwtProps;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT 토큰 관련 기능을 제공하는 클래스
 * -토큰 생성
 * -토큰 해석
 * -토큰 검증
 */
@Slf4j
@Component
public class JwtProvider {

    @Autowired
    private JwtProps jwtProps;

    @Autowired
    private UserMapper userMapper;
    
    
    public String createToken(String id,String username, List<String> roles){
        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = secretKey.getBytes();
        SecretKey shakey = Keys.hmacShaKeyFor(signingKey);

        int exp = 1000 * 3600 * 24 * 5;

        // JWT 토큰 생성
        String jwt = Jwts.builder()
                            .signWith(shakey,Jwts.SIG.HS512) // 시그니처 비밀키, 알고리즘 설정
                            .header()
                                .add("typ",SecurityConstants.TOKEN_TYPE) // typ:jwt
                            .and()
                            .expiration(new Date(System.currentTimeMillis()+exp))
                            .claim("id", id)            //id  : 사용자 식별키
                            .claim("username", username)//username : 사용자 아이디
                            .claim("rol", roles) // rol : 회원 권한 목록
                            .compact();
        log.info("jwt : "+jwt);
        return jwt;
    }
    
    /**
     * 토큰 해석
     * @param authorization
     * @return
     */
    public UsernamePasswordAuthenticationToken getAuthenticationToken(String authorization){
        if( authorization == null || authorization.length() == 0)
            return null;

        // Authorization : "Bearer {jwt}"
        try{
            //jwt 추출
            String jwt = authorization.replace("Bearar ", "");
            log.info("jwt : "+jwt);

            SecretKey shaKey = getShaKey();

            Jws<Claims> parsedToken = Jwts.parser()
                                                .verifyWith(shaKey)
                                                .build()
                                                .parseSignedClaims(jwt);
            log.info("parsedToken : " + parsedToken);                                  

            // 사용자 식별키(id)
            String id = parsedToken.getPayload().get("id").toString();
            // 사용자 아이디
            String username = parsedToken.getPayload().get("username").toString();
            // 회원 권한
            Object roles = parsedToken.getPayload().get("rol");

            Users user = new Users();
            user.setId(id);
            user.setUsername(username);
            List<UserAuth> authList = ((List<?>) roles)
                                            .stream()
                                            .map( auth -> UserAuth.builder()
                                                            .userId(username)
                                                            .auth(auth.toString())
                                                            .build()
                                                )
                                            .collect(Collectors.toList())
                                            ;
            user.setAuthList(authList);

            // 시큐리티 권한 목록
            List<SimpleGrantedAuthority> authorities = ((List<?>) roles)
                                                            .stream()
                                                            .map( auth -> new SimpleGrantedAuthority(auth.toString()) )
                                                            .collect( Collectors.toList());

            // 추가 유저정보 가져오기
            try{
                Users userInfo = userMapper.selectl(username);
                if( userInfo != null){
                    user.setName(userInfo.getName());
                    user.setEmail(userInfo.getEmail());
                }
            }catch(Exception e){
                log.error(e.getMessage());
                log.error("토큰 해석 중, 회원 추가 정보 조회 시 에러 발생");
            }

            UserDetails userDetails = new CustomUser(user);

            // new UsernamePasswordAuthenticationToken( 사용자정보객체, 비밀번호, 권한목록)
            return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

        } catch (ExpiredJwtException exception) {
            log.warn("Request to parse expired JWT : {} failed : {}", authorization, exception.getMessage());
        } catch (UnsupportedJwtException exception) {
            log.warn("Request to parse unsupported JWT : {} failed : {}", authorization, exception.getMessage());
        } catch (MalformedJwtException exception) {
            log.warn("Request to parse invalid JWT : {} failed : {}", authorization, exception.getMessage());
        } catch (IllegalArgumentException exception) {
            log.warn("Request to parse empty or null JWT : {} failed : {}", authorization, exception.getMessage());
        }
        return null;
    }

    public boolean validateToken(String jwt){
        try{
            Jws<Claims> claims = Jwts.parser()
                                    .verifyWith(getShaKey())
                                    .build()
                                    .parseSignedClaims(jwt);
            
            Date expiration = claims.getPayload().getExpiration();
            log.info("만료기간 : " + expiration.toString());

            // 날짜A.after( 날짜B )
            // : 날짜A가 날짜B 보다 더 뒤에 있으면 true
            boolean result = expiration.after( new Date() );
            return result;
        }
        catch(ExpiredJwtException e){
            log.error("토큰 만료");
        }
        catch(JwtException e){
            log.error("토큰 손상");
        }catch(NullPointerException e){
            log.error("토큰 없음");
        }catch(Exception e){
            log.error("토큰 검증 시 예외");
        }
        return false;
    }

    /**
     * "secret-key" => byte[] -> SecretKey
     * @return
     */
    public SecretKey getShaKey(){
        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = secretKey.getBytes();
        SecretKey shaKey = Keys.hmacShaKeyFor(signingKey);
        return shaKey;
    }

}
